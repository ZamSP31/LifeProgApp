using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations.Schema;


namespace LifeProgApp.Models
{
    [Table("users")]
    public class UserModel
    {

        [Key]
        public int user_id { get; set; }
        public string email { get; set; }
        public string password_hash { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string gender { get; set; }
        //public DateTime dateOfBirth { get; set; }
        public int current_level { get; set; }
        public int total_xp { get; set; }
        public DateTime last_login { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}