using LifeProgApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LifeProgApp.Controllers
{
    public class DefController : Controller
    {
        private object getData;

        // GET: _DefCon
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



       

        //[HttpPost]
        //public JsonResult UpdateDatabase()
        //{
        //    // --- TODO: INSERT SQL LOGIC HERE ---

        //    // Mock Data to send back to the table
        //    var logs = new List<object>
        //    {
        //        new { Id = 101, Action = "Inventory Check", Status = "Success", Time = DateTime.Now.ToShortTimeString() },
        //        new { Id = 102, Action = "Update Prices", Status = "Pending", Time = DateTime.Now.ToShortTimeString() }
        //    };

        //    // AllowGet is required in MVC 5 for JSON returns sometimes, though usually fine for Post
        //    return Json(new { success = true, data = logs });
        //}





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
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace} ");
            }
        }

            public void UpdateData()
            {
                try
                {
                    using (var db = new Models.AppContext())
                    {
                        // 1. You fetch the data into the variable 'registration'
                        var getData = db.tbl_registration.Where(x => x.registrationID == 1).FirstOrDefault();

                        // CRITICAL FIX: Check if data exists first to prevent a crash
                        if (getData != null)
                        {
                        // 2. Use 'registration' here, NOT 'getData'
                            getData.firstName = "UpdatedName";
                            getData.lastName = "UpdatedLastName";
                            getData.createdAt = DateTime.Now;
                            getData.updatedAt = DateTime.Now;

                            // 3. Save the changes to the database
                            db.SaveChanges();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new ArgumentException($"An error occured : {ex.Message}");
                }
            }



        // get data process (changes)
        // 1. GetData()
        // 2. getData(int archivedID)
        // 3. var getData = db.tbl_registration.Where(x => x.isArchived == 0).ToList();
        // 4. var getData = db.tbl_registration.Where(x => x.isArchived == archived).ToList();
        // 5. 

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
                    throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace} "); 
                }
        }



            //archive data process
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
                    return Json(getNotArchiveData , JsonRequestBehavior.AllowGet);


                    return Json(new { success = true, message = "Data archived successfully." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"An error occured : {ex.Message} : {ex.InnerException} : {ex.StackTrace} ");
            }
        }   



    }
}