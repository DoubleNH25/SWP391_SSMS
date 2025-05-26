using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMMS.Domain.Interface.Repositories
{
	public interface IRepositoryManager
	{
		//Fill with each interface entity repository
		IUserRepository UserRepository { get; }
		//Fill with each entity repository

		Task SaveAsync();
	}
}
