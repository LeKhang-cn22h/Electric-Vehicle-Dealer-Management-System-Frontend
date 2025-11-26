<template>
  <component :is="layoutComponent">
    <div>
      <h1 class="text-xl font-bold mb-4">Quản lý phản hồi</h1>

      <ManageFeedbackTable
        :items="filteredItems"
        :keyword="keyword"
        @view-detail="viewFeedbackDetail"
        @update:keyword="keyword = $event"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "#app";
import ManageFeedbackTable from "~/components/feedback/Manage_FeedbackTable.vue";
import { feedbackList } from "~/data/feedback";
import DealerManagerLayout from "~/layouts/dealer-manager-layout.vue";
import EvmStaffLayout from "~/layouts/evm-staff-layout.vue";
import DefaultLayout from "~/layouts/default.vue";

const router = useRouter();
const { me } = useMe();

const keyword = ref("");

const filteredItems = computed(() => {
  if (!keyword.value.trim()) return feedbackList;
  return feedbackList.filter((fb) =>
    fb.title.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

const role = computed(() => {
  const u: any = me.value;
  if (!u) return null;

  return (
    u.user_metadata?.role ||
    (Array.isArray(u.user_metadata?.roles) ? u.user_metadata.roles[0] : null) ||
    u.role ||
    null
  );
});

const layoutComponent = computed(() => {
  switch (role.value) {
    case "dealer_manager":
      return DealerManagerLayout;
    case "evm_staff":
      return EvmStaffLayout;
    default:
      return DefaultLayout;
  }
});

function viewFeedbackDetail(id: number) {
  console.log("Click xem chi tiết id:", id);
  router.push(`/manage_Feedback/${id}`);
}
definePageMeta({
  layout: false,
});
</script>
