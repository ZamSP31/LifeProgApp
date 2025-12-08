using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;


namespace LifeProgApp.Models
{


    [Table("tbl_images")]
    public class tblImagesModel
    {

        [Key]
        public int imageID { get; set; }
        public string imagePath { get; set; }
        public string imageName { get; set; }
        public int? questID { get; set; }  
        public DateTime createdAt { get; set; }
        public DateTime updateAt { get; set; }
    }
}