using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class UserModel
    {
        public int userId { get; set; }
        public string email { get; set; }
        public string passwordHash { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string gender { get; set; }
        public DateTime dateOfBirth { get; set; }
        public int currentLevel { get; set; }
        public int totalXP { get; set; }
        public DateTime lastLogin { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}