using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class tblRegistrationModel
    {
        public int registrationID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }

        public int isArchived { get; set; }




    }
}