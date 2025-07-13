using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SMMS.Infrastructure.Hubs
{
	[Authorize]
	public class NotificationHub : Hub
	{
		public async Task SendNotification(string userId, string message)
		{
			// Gửi thông báo tới người dùng cụ thể dựa trên userId
			await Clients.User(userId).SendAsync("ReceiveNotification", message);
		}

		// Ghi đè phương thức OnConnectedAsync để xử lý khi client kết nối
		public override async Task OnConnectedAsync()
		{
			var userId = Context.UserIdentifier;
			if (!string.IsNullOrEmpty(userId))
			{
				await base.OnConnectedAsync();
			}
			else
			{
				throw new HubException("User not authenticated.");
			}
		}
	}
}
