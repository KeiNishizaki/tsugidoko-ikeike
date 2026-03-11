using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace TsugiDoko.Functions
{
    public class AiDecisionFunction
    {
        private readonly ILogger _logger;
        private readonly string openAiEndpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
        private readonly string openAiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_KEY");
        private readonly string deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_NAME");

        public AiDecisionFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<AiDecisionFunction>();
        }

        [Function("GetAiDecision")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "decide")] HttpRequestData req)
        {
            _logger.LogInformation("次のお店強制決定リクエストを受信しました。");

            try
            {
                // 環境変数が取れているかチェック（キーは隠す）
                if (string.IsNullOrEmpty(openAiEndpoint) || string.IsNullOrEmpty(openAiKey))
                {
                    throw new Exception("環境変数 AZURE_OPENAI_ENDPOINT または AZURE_OPENAI_KEY が空っぽです！Azureポータルの設定を確認してください。");
                }

                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var context = JsonSerializer.Deserialize<VisitingContext>(requestBody, options);

                AzureOpenAIClient azureClient = new AzureOpenAIClient(
                    new Uri(openAiEndpoint), 
                    new ApiKeyCredential(openAiKey));
                
                ChatClient chatClient = azureClient.GetChatClient(deploymentName);

                var chatOptions = new ChatCompletionOptions { Temperature = 0.7f };

                string systemPrompt = @"
                    あなたは「くだらないことでぐだらない」を信条とする、少し強引ですが愛嬌のある案内人です。
                    ユーザーの状況から、次に行くべきお店を決定し、以下の3つの情報を必ず厳密なJSON形式のみで出力してください。
                    1. ""category"": 次に行く明確な場所・行き先の手掛かり（例：静かなバー、深夜のラーメン、ダーツバー など。画面に大きく表示されます）
                    2. ""keyword"": その場所をGoogle Mapsで検索するための具体的なキーワード（例：バー 静か、ラーメン 深夜、ダーツ など。場所のカテゴリと用途の単語をスペース区切りで）
                    3. ""reason"": そこに行くべき理由（少し偉そうに、ユーモアたっぷりに）

                    フォーマット例: { ""category"": ""静かなバー"", ""keyword"": ""バー 静か"", ""reason"": ""居酒屋でいい感じにほろ酔い？次は静かなバーでしっとり語り合え！酔いの余韻を大事にしろよ！"" }";
                
                string userPrompt = $"人数: {context.Participants}, グループ: {context.GroupType}, 直前の行動: {context.RecentAction}, 酔い度: {context.Drunkenness}/100, 要望: {context.Request}";

                ChatCompletion completion = await chatClient.CompleteChatAsync(
                    [
                        new SystemChatMessage(systemPrompt),
                        new UserChatMessage(userPrompt)
                    ], chatOptions);

                var res = req.CreateResponse(HttpStatusCode.OK);
                res.Headers.Add("Content-Type", "application/json; charset=utf-8");
                await res.WriteStringAsync(completion.Content[0].Text);

                return res;
            }
            catch (Exception ex)
            {
                // エラーの真犯人をログに吐き出す
                _logger.LogError($"【エラー大爆発】: {ex.Message}");
                _logger.LogError($"【スタックトレース】: {ex.StackTrace}");
                
                // フロントエンドにもエラー理由を返す
                var errorRes = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorRes.WriteStringAsync($"エラー発生: {ex.Message}");
                return errorRes;
            }
        }
    }

    public class VisitingContext
    {
        public int Participants { get; set; }
        public string GroupType { get; set; }
        public string RecentAction { get; set; }
        public int Drunkenness { get; set; }
        public string Request { get; set; }
    }
}