using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("archive_status")]
    public class ArchiveStatusModel
    {

        [Key]
        public int status_id { get; set; }
        public string stat_description { get; set; }
       
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}