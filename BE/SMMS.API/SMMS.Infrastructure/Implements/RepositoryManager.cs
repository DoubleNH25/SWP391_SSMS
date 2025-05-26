using SMMS.Domain.Interface.Repositories;
using SMMS.Infrastructure.Context;


namespace SMMS.Infrastructure.Implements
{
	public class RepositoryManager : IRepositoryManager
	{
		private readonly DatabaseContext _context;
		private IUserRepository _userRepository;


		public RepositoryManager(DatabaseContext context)
		{
			_context = context;
			_userRepository = new UserRepository(context);
		}

		public IUserRepository UserRepository
		{
			get
			{
				return _userRepository;
			}
		}

		public Task SaveAsync() => _context.SaveChangesAsync();
	}
}
