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



        //New methods can be added here
        // ADD THESE METHODS TO YOUR DefController.cs FILE
        // Place them after your existing methods

        // ==========================================
        // DASHBOARD DATA METHODS
        // ==========================================

        /// <summary>
        /// Get dashboard data for logged-in user
        /// </summary>
        [HttpGet]
        public JsonResult GetDashboardData(int userId = 1) // Default to demo user
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    // Get user info
                    var user = db.Users.FirstOrDefault(u => u.UserId == userId);
                    if (user == null)
                    {
                        return Json(new { success = false, message = "User not found" }, JsonRequestBehavior.AllowGet);
                    }

                    // Get user stats
                    var stats = db.UserStats.FirstOrDefault(s => s.UserId == userId);

                    // Get active goals count
                    var activeGoalsCount = db.Goals.Count(g => g.UserId == userId && g.Status == "active");

                    var dashboardData = new
                    {
                        userId = user.UserId,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        currentLevel = user.CurrentLevel,
                        totalXP = user.TotalXP,
                        totalQuestsCompleted = stats?.TotalQuestsCompleted ?? 0,
                        totalGoalsAchieved = stats?.TotalGoalsAchieved ?? 0,
                        currentStreak = stats?.CurrentStreak ?? 0,
                        weeklyQuestCount = stats?.WeeklyQuestCount ?? 0,
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

        /// <summary>
        /// Get all active goals for a user
        /// </summary>
        [HttpGet]
        public JsonResult GetUserGoals(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var goals = db.Goals
                        .Where(g => g.UserId == userId && g.Status == "active")
                        .Select(g => new
                        {
                            goalId = g.GoalId,
                            title = g.Title,
                            description = g.Description,
                            currentValue = g.CurrentValue,
                            targetValue = g.TargetValue,
                            unit = g.Unit,
                            targetDate = g.TargetDate,
                            progressPercentage = (int)((g.CurrentValue / g.TargetValue) * 100),
                            daysRemaining = System.Data.Entity.DbFunctions.DiffDays(DateTime.Now, g.TargetDate)
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

        /// <summary>
        /// Get today's quests for a user
        /// </summary>
        [HttpGet]
        public JsonResult GetTodaysQuests(int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var today = DateTime.Today;
                    var quests = db.DailyQuests
                        .Where(q => q.UserId == userId && DbFunctions.TruncateTime(q.QuestDate) == today)
                        .Select(q => new
                        {
                            questId = q.QuestId,
                            title = q.Title,
                            description = q.Description,
                            difficulty = q.Difficulty,
                            xpReward = q.XPReward,
                            isCompleted = q.IsCompleted
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

        /// <summary>
        /// Complete a quest
        /// </summary>
        [HttpPost]
        public JsonResult CompleteQuest(int questId, int userId = 1)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var quest = db.DailyQuests.FirstOrDefault(q => q.QuestId == questId && q.UserId == userId);

                    if (quest == null)
                    {
                        return Json(new { success = false, message = "Quest not found" });
                    }

                    if (quest.IsCompleted)
                    {
                        return Json(new { success = false, message = "Quest already completed" });
                    }

                    // Mark quest as completed
                    quest.IsCompleted = true;
                    quest.UpdatedAt = DateTime.Now;

                    // Award XP to user
                    var user = db.Users.FirstOrDefault(u => u.UserId == userId);
                    if (user != null)
                    {
                        user.TotalXP += quest.XPReward;
                        user.UpdatedAt = DateTime.Now;
                    }

                    // Update user stats
                    var stats = db.UserStats.FirstOrDefault(s => s.UserId == userId);
                    if (stats != null)
                    {
                        stats.TotalQuestsCompleted++;
                        stats.WeeklyQuestCount++;
                        stats.LastQuestDate = DateTime.Now;
                        stats.UpdatedAt = DateTime.Now;
                    }

                    db.SaveChanges();

                    return Json(new
                    {
                        success = true,
                        message = "Quest completed!",
                        xpEarned = quest.XPReward,
                        newTotalXP = user?.TotalXP ?? 0
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Update goal progress
        /// </summary>
        [HttpPost]
        public JsonResult UpdateGoalProgress(int goalId, decimal newValue)
        {
            try
            {
                using (var db = new Models.AppContext())
                {
                    var goal = db.Goals.FirstOrDefault(g => g.GoalId == goalId);

                    if (goal == null)
                    {
                        return Json(new { success = false, message = "Goal not found" });
                    }

                    goal.CurrentValue = newValue;
                    goal.UpdatedAt = DateTime.Now;

                    // Check if goal is completed
                    if (newValue >= goal.TargetValue && goal.Status != "completed")
                    {
                        goal.Status = "completed";
                        goal.CompletedAt = DateTime.Now;

                        // Update user stats
                        var stats = db.UserStats.FirstOrDefault(s => s.UserId == goal.UserId);
                        if (stats != null)
                        {
                            stats.TotalGoalsAchieved++;
                            stats.UpdatedAt = DateTime.Now;
                        }
                    }

                    db.SaveChanges();

                    var progressPercentage = (int)((newValue / goal.TargetValue) * 100);

                    return Json(new
                    {
                        success = true,
                        message = "Goal progress updated!",
                        progressPercentage = progressPercentage,
                        isCompleted = goal.Status == "completed"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get goal categories
        /// </summary>
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
                            categoryId = c.CategoryId,
                            categoryName = c.CategoryName,
                            description = c.Description,
                            iconName = c.IconName
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