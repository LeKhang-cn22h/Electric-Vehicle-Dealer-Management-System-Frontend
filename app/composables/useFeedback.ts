import { ref } from 'vue'

export interface Feedback {
  id: number
  tieuDe: string
  ngayGui: string
  trangThai: boolean
  noidung?: string
  phanHoiAdmin?: string
}

export function useFeedback() {
  const feedbacks = ref<Feedback[]>([])
  const keyword = ref('')

  function fetchFeedbacks() {
    // call API 
    feedbacks.value = [
      { id: 1, tieuDe: 'Phản hồi về dịch vụ', ngayGui: '2024-06-01', trangThai:  true,noidung: 'Dịch vụ rất tốt, tôi rất hài lòng.', phanHoiAdmin: 'Cảm ơn bạn đã phản hồi!' },
      { id: 2, tieuDe: 'Ý kiến về sản phẩm', ngayGui: '2024-06-02', trangThai: false, noidung: 'Sản phẩm cần cải thiện chất lượng.', phanHoiAdmin: '' },
    ]
  }

  return { feedbacks, keyword, fetchFeedbacks }
}
