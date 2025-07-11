using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SMMS.Application.Helpers.Interface;

namespace SMMS.Application.Helpers.Implements
{
    public class SendMailService
    {
        private readonly IRedisCacheService _redisCacheService;

        public SendMailService(IRedisCacheService redisCacheService)
        {
            _redisCacheService = redisCacheService;
        }

        public async Task SendOtpAsync(string email)
        {
            // Tạo OTP 6 số
            var otp = new Random().Next(100000, 999999).ToString();

            // Lưu OTP vào Redis với key là otp:{email} và thời hạn 5 phút
            string redisKey = $"otp:{email}";
            await _redisCacheService.SetAsync(redisKey, otp, TimeSpan.FromMinutes(5));

            // Gửi email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("SMMS", "kietnase170077@fpt.edu.vn"));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = "Mã OTP của bạn";
            message.Body = new TextPart("plain")
            {
                Text = $"Mã xác thực SMMS của bạn là: {otp}. Mã này sẽ hết hạn sau 5 phút."
            };

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("thoaidtse170076@fpt.edu.vn", "gnmjhwhbyoovvigw");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
