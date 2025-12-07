using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class tblImagesModel
    {

        [Key]
        public int imageID{ get; set; }
        public string imagePath{ get; set; }
        public string imageName{ get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updateAt { get; set; }
    }
}