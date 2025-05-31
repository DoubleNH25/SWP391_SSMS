

namespace SMMS.Application.DataObject.ResponseObject
{
	public class VaccinationCampaignResponse
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public string VaccineName { get; set; }
		public DateTime EXP { get; set; }
		public DateTime MFG { get; set; }
		public string VaccineType { get; set; }
		public DateTime StartDate { get; set; }
		public bool IsAccepted { get; set; }
	}
}
