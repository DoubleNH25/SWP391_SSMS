using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;
using SMMS.Infrastructure.Context;

namespace SMMS.Infrastructure.Implements
{
    public class ClassRepository : RepositoryBase<Class>, IClassRepository
    {
        public ClassRepository(DatabaseContext context) : base(context) { }
    }
}
