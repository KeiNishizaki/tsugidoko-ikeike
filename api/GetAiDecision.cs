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
                    ユーザーの状況から、次に行くべきお店の『検索キーワード（1語〜2語）』と、『そこに行くべき理由（少し偉そうに、ユーモアたっぷりに）』をJSON形式で出力してください。
                    フォーマット: { ""keyword"": ""ラーメン 深夜"", ""reason"": ""男4人で麻雀終わり？頭使って腹減ってんだろ！つべこべ言わずにラーメン食ってこい！"" }";
                
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