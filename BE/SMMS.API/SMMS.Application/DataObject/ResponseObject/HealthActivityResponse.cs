

namespace SMMS.Application.DataObject.ResponseObject
{
	public class HealthActivityResponse
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public DateTime ScheduledDate { get; set; }
		public bool IsAccepted { get; set; }
	}
}
