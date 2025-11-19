export const useRoleBasedLayout = () => {
    const userRole = useCookie("role");

    const layoutName = computed(() => {
        const role = userRole.value?.toLowerCase();
        if (role === "dealer_staff") {
            return "dealer-manager-layout";
        } else if (role === "admin") {
            return "admin";
        }
        return "default";
    });

    const applyLayout = () => {
        setPageLayout(layoutName.value);
    };

    return {
        layoutName,
        applyLayout,
    };
};
