import { ref } from 'vue'

export interface Feedback {
  id: number
  tieuDe: string
  ngayGui: string
  trangThai: string
}

export function useFeedback() {
  const feedbacks = ref<Feedback[]>([])
  const keyword = ref('')

  function fetchFeedbacks() {
    // call API 
    feedbacks.value = [
      { id: 1, tieuDe: 'Phản hồi về dịch vụ', ngayGui: '2024-06-01', trangThai: 'Đã phản hồi' },
      { id: 2, tieuDe: 'Ý kiến về sản phẩm', ngayGui: '2024-06-02', trangThai: 'Chưa phản hồi' },
    ]
  }

  return { feedbacks, keyword, fetchFeedbacks }
}
