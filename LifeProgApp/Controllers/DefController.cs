using LifeProgApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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


        // create data
        [HttpPost]
        public JsonResult Create(string firstName, string lastName, string gender, string email, string password)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var registration = new tblRegistrationModel
                    {
                        firstName = firstName,
                        lastName = lastName,
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now,
                        isArchived = 0
                    };

                    db.tbl_registration.Add(registration);
                    db.SaveChanges();

                    return Json(new { success = true, message = "Registration successful!" });
                }
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return Json(new { success = false, message = $"Error: {innerMessage}" });
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

        // UPDATED: Fixed ArchiveData to accept the Model (Prevents 500 Error on Delete)

        public JsonResult ArchiveData(tblRegistrationModel user)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var dataToArchive = db.tbl_registration
                                          .Where(x => x.registrationID == user.registrationID)
                                          .FirstOrDefault();

                    if (dataToArchive != null)
                    {
                        dataToArchive.isArchived = 1; // Soft delete
                        db.SaveChanges();
                        return Json(new { success = true, message = "User archived" }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ====================================================================
        // UPDATE USER
        // ====================================================================

        [HttpPost]
        public JsonResult UpdateUser(tblRegistrationModel user)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var existingUser = db.tbl_registration
                                         .Where(x => x.registrationID == user.registrationID)
                                         .FirstOrDefault();

                    if (existingUser != null)
                    {
                        existingUser.firstName = user.firstName;
                        existingUser.lastName = user.lastName;
                        existingUser.updatedAt = DateTime.Now;

                        db.SaveChanges();

                        return Json(new { success = true, message = "User updated successfully" }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Server Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
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

        // ====================================================================
        // NEW: QUEST PHOTO UPLOAD METHOD
        // ====================================================================
        [HttpPost]
        public JsonResult UploadQuestPhoto(int questId)
        {
            try
            {
                if (Request.Files.Count == 0)
                    return Json(new { success = false, message = "No file received" });

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
                            questID = questId,  // Link to quest
                            createdAt = DateTime.Now,
                            updateAt = DateTime.Now
                        };

                        db.tbl_images.Add(newImage);
                        db.SaveChanges();

                        // Update quest with imageID
                        var quest = db.DailyQuests.FirstOrDefault(q => q.quest_id == questId);
                        if (quest != null)
                        {
                            quest.imageID = newImage.imageID;
                            db.SaveChanges();
                        }

                        return Json(new
                        {
                            success = true,
                            message = "Photo uploaded successfully!",
                            imageId = newImage.imageID,
                            imagePath = "/Content/Uploads/" + fileName
                        });
                    }
                }

                return Json(new { success = false, message = "Upload failed" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        // ====================================================================
        // NEW: GET QUEST PHOTOS
        // ====================================================================
        [HttpGet]
        public JsonResult GetQuestPhotos(int questId)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var images = db.tbl_images
                        .Where(i => i.questID == questId)
                        .Select(i => new
                        {
                            imageID = i.imageID,
                            imageName = i.imageName,
                            imagePath = i.imagePath,
                            createdAt = i.createdAt
                        })
                        .ToList();

                    return Json(new { success = true, data = images }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ====================================================================
        // NEW: GET ALL QUEST PHOTOS FOR USER
        // ====================================================================
        [HttpGet]
        public JsonResult GetAllQuestPhotos(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var questPhotos = db.DailyQuests
                        .Where(q => q.user_id == userId && q.imageID != null)
                        .Join(db.tbl_images,
                            quest => quest.imageID,
                            image => image.imageID,
                            (quest, image) => new
                            {
                                questId = quest.quest_id,
                                questTitle = quest.title,
                                questDate = quest.quest_date,
                                isCompleted = quest.is_completed,
                                imageId = image.imageID,
                                imagePath = image.imagePath,
                                imageName = image.imageName,
                                uploadedAt = image.createdAt
                            })
                        .OrderByDescending(x => x.uploadedAt)
                        .ToList();

                    return Json(new { success = true, data = questPhotos }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
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

        // ==========================================
        // DASHBOARD DATA METHODS
        // ==========================================

        [HttpGet]
        public JsonResult GetDashboardData(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var user = db.Users.FirstOrDefault(u => u.user_id == userId);
                    if (user == null)
                    {
                        return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
                    }

                    var stats = db.UserStats.FirstOrDefault(s => s.user_id == userId);
                    var activeGoalsCount = db.Goals.Count(g => g.goal_id == userId && g.status == "active");

                    var dashboardData = new
                    {
                        userId = user.user_id,
                        firstName = user.first_name,
                        lastName = user.last_name,
                        email = user.email,
                        currentLevel = user.current_level,
                        totalXP = user.total_xp,
                        totalQuestsCompleted = stats?.total_quests_completed ?? 0,
                        totalGoalsAchieved = stats?.total_goals_achieved ?? 0,
                        currentStreak = stats?.current_streak ?? 0,
                        weeklyQuestCount = stats?.weekly_quest_count ?? 0,
                        activeGoalsCount = activeGoalsCount
                    };

                    return Json(new { success = true, data = dashboardData }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetUserGoals(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var goals = db.Goals
                        .Where(g => g.user_id == userId && g.status == "active")
                        .Select(g => new
                        {
                            goalId = g.goal_id,
                            title = g.title,
                            description = g.description,
                            currentValue = g.current_value,
                            targetValue = g.target_value,
                            unit = g.unit,
                            targetDate = g.target_date,
                            progressPercentage = (int)((g.current_value / g.target_value) * 100),
                            daysRemaining = System.Data.Entity.DbFunctions.DiffDays(DateTime.Now, g.target_date)
                        })
                        .OrderBy(g => g.targetDate)
                        .ToList();

                    return Json(new { success = true, data = goals }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetTodaysQuests(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var today = DateTime.Today;
                    var quests = db.DailyQuests
                        .Where(q => q.user_id == userId && DbFunctions.TruncateTime(q.quest_date) == today)
                        .Select(q => new
                        {
                            questId = q.quest_id,
                            title = q.title,
                            description = q.description,
                            difficulty = q.difficulty,
                            xpReward = q.xp_reward,
                            isCompleted = q.is_completed,
                            imageID = q.imageID,  // Include image info
                            hasPhoto = q.imageID != null
                        })
                        .OrderBy(q => q.isCompleted)
                        .ThenByDescending(q => q.xpReward)
                        .ToList();

                    return Json(new { success = true, data = quests }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CompleteQuest(int questId, int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var quest = db.DailyQuests.FirstOrDefault(q => q.quest_id == questId && q.user_id == userId);

                    if (quest == null)
                        return Json(new { success = false, message = "Quest not found" });

                    if (quest.is_completed)
                        return Json(new { success = false, message = "Quest already completed" });

                    quest.is_completed = true;
                    quest.updated_at = DateTime.Now;

                    var user = db.Users.FirstOrDefault(u => u.user_id == userId);
                    if (user != null)
                    {
                        user.total_xp += quest.xp_reward;
                        user.updated_at = DateTime.Now;
                    }

                    var stats = db.UserStats.FirstOrDefault(s => s.user_id == userId);
                    if (stats != null)
                    {
                        stats.total_quests_completed++;
                        stats.weekly_quest_count++;
                        stats.last_quest_date = DateTime.Now;
                        stats.updated_at = DateTime.Now;
                    }

                    db.SaveChanges();

                    return Json(new
                    {
                        success = true,
                        message = "Quest completed!",
                        xpEarned = quest.xp_reward,
                        newTotalXP = user?.total_xp ?? 0
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        [HttpPost]
        public JsonResult UpdateGoalProgress(int goalId, decimal newValue)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var goal = db.Goals.FirstOrDefault(g => g.goal_id == goalId);

                    if (goal == null)
                        return Json(new { success = false, message = "Goal not found" });

                    goal.current_value = newValue;
                    goal.updated_at = DateTime.Now;

                    if (newValue >= goal.target_value && goal.status != "completed")
                    {
                        goal.status = "completed";
                        goal.completed_at = DateTime.Now;

                        var stats = db.UserStats.FirstOrDefault(s => s.user_id == goal.user_id);
                        if (stats != null)
                        {
                            stats.total_goals_achieved++;
                            stats.updated_at = DateTime.Now;
                        }
                    }

                    db.SaveChanges();

                    var progressPercentage = (int)((newValue / goal.target_value) * 100);

                    return Json(new
                    {
                        success = true,
                        message = "Goal progress updated!",
                        progressPercentage = progressPercentage,
                        isCompleted = goal.status == "completed"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet]
        public JsonResult GetGoalCategories()
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var categories = db.GoalCategories
                        .Select(c => new
                        {
                            categoryId = c.category_id,
                            categoryName = c.category_id,
                            description = c.description,
                            iconName = c.icon_name,
                        })
                        .ToList();

                    return Json(new { success = true, data = categories }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}