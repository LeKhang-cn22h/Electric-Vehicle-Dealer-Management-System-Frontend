import { createRouter, createWebHistory } from 'vue-router'
import FeedbackListPage from '../pages/Customer/Feedback/FeedbackDetailPage.vue'
import FeedbackDetailPage from '../pages/Customer/Feedback/FeedbackDetailPage.vue'
import CreateFeedbackPage from '../pages/Customer/Feedback/Sendfeedback.vue'

export const routes = {
  CreateFB: '/Customer/Feedback/Sendfeedback',
  FeedbackDetail: '/Customer/Feedback/FeedbackDetailPage/:id'
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: routes.CreateFB,
      name: 'CreateFeedback',
      component: CreateFeedbackPage
    },
    {
      path: routes.FeedbackDetail, 
      name: 'FeedbackDetail',
      component: FeedbackDetailPage
    }
  ]
})

export default router
