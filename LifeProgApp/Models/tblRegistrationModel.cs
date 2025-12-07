using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models



{

    [Table("tbl_registration")]
    public class tblRegistrationModel
    {

        [Key]   
        public int registrationID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }

        public int isArchived { get; set; }




    }
}