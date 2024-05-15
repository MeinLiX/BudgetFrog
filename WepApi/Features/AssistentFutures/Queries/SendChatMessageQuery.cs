using WepApi.Features.Services;
using WepApi.Models.Externals.Assistant;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.AssistentFutures.Queries;

public class SendChatMessageQuery : IRequest<Result<string>>
{
    public List<AssistRequest.MessageChat> Messages { get; set; } = [];
    public List<string> StringMessages { get; set; } = [];

    public class SendChatMessageQueryHandler : IRequestHandler<SendChatMessageQuery, Result<string>>
    {
        private readonly SignInManagerService _signInManager;
        private readonly OllamaService _ollamaService;

        public SendChatMessageQueryHandler(SignInManagerService signInManager, OllamaService ollamaService)
        {
            _signInManager = signInManager;
            _ollamaService = ollamaService;

        }

        public async Task<Result<string>> Handle(SendChatMessageQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if(query.Messages.Count > 0) return Result<string>.Success(data: await _ollamaService.SendChatMessage(query.Messages));
            if (query.StringMessages.Count > 0) return Result<string>.Success(data: await _ollamaService.SendChatMessage(query.StringMessages));

            return Result<string>.Fail("Chat is empty.");
        }

    }
}
