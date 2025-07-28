import express from "express"

import { createCheckoutSession, getAllPurchasedCourses, getCourseDetailsWithPurchaseStatus, stripeWebhook } from "../controllers/coursePurchase.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router =express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);

router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook);
  router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailsWithPurchaseStatus);

router.route("/").get(isAuthenticated,getAllPurchasedCourses);
export default router;