using LifeProgApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;

namespace LifeProgApp.Controllers
{
    public class DefController : Controller
    {
        // ====================================================================
        // PAGE NAVIGATION ACTIONS
        // ====================================================================

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ProgressPage()
        {
            return View();
        }

        public ActionResult LoginPage()
        {
            return View();
        }

        public ActionResult OverviewPage()
        {
            return View();
        }

        public ActionResult GalleryPage()
        {
            return View();
        }

        public ActionResult RegistrationPage()
        {
            return View();
        }

        public ActionResult DashboardPage()
        {
            return View();
        }

        public ActionResult GoalsPage()
        {
            return View();
        }


        // ====================================================================
        // DATA MANIPULATION METHODS
        // ====================================================================

        public void AddData()
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var registration = new tblRegistrationModel
                    {
                        firstName = "Zamuelle",
                        lastName = "SanPablo",
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now
                    };
                    db.tbl_registration.Add(registration);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace}");
            }
        }

        public void UpdateData()
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var getData = db.tbl_registration.Where(x => x.registrationID == 1).FirstOrDefault();

                    if (getData != null)
                    {
                        getData.firstName = "UpdatedName";
                        getData.lastName = "UpdatedLastName";
                        getData.createdAt = DateTime.Now;
                        getData.updatedAt = DateTime.Now;

                        db.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message}");
            }
        }


        // ====================================================================
        // JSON RESULT METHODS
        // ====================================================================

        public JsonResult GetData()
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var getData = db.tbl_registration.Where(x => x.isArchived == 0).ToList();
                    return Json(new { success = true, data = getData }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace}");
            }
        }

        public JsonResult ArchiveData(int registrationID)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var getData = db.tbl_registration.Where(x => x.registrationID == registrationID).FirstOrDefault();
                    getData.isArchived = 1;
                    db.SaveChanges();

                    var getNotArchiveData = db.tbl_registration.Where(x => x.isArchived == 0).ToList();
                    return Json(getNotArchiveData, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace}");
            }
        }

        [HttpPost]
        public JsonResult UpdateUser(int registrationID, string firstName, string lastName)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var user = db.tbl_registration.Where(x => x.registrationID == registrationID).FirstOrDefault();

                    if (user != null)
                    {
                        user.firstName = firstName;
                        user.lastName = lastName;
                        user.updatedAt = DateTime.Now;

                        db.SaveChanges();

                        return Json(new { success = true, message = "User updated successfully" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }


        // ====================================================================
        // FILE UPLOAD METHODS
        // ====================================================================

        [HttpPost]
        public JsonResult Upload()
        {
            if (Request.Files.Count == 0)
                return Json(new { Message = "No file received" });

            HttpPostedFileBase file = Request.Files[0];

            if (file != null && file.ContentLength > 0)
            {
                string uploadPath = Server.MapPath("~/Content/Uploads/");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                string filePath = Path.Combine(uploadPath, fileName);
                file.SaveAs(filePath);

                using (var db = new Models.AppContext())
                {
                    var newImage = new tblImagesModel
                    {
                        imageName = fileName,
                        imagePath = "~/Content/Uploads/" + fileName,
                        createdAt = DateTime.Now,
                        updateAt = DateTime.Now
                    };

                    db.tbl_images.Add(newImage);
                    db.SaveChanges();
                }

                return Json(new { Message = "File uploaded succesfully!", FilePath = "/Content/Uploads/" + fileName });
            }

            return Json(new { Message = "Upload Failed." });
        }

        public JsonResult GetCarouselImagesFunc()
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var images = db.tbl_images.Select(x => x).ToList();
                    return Json(images, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace}");
            }
        }
    }
}