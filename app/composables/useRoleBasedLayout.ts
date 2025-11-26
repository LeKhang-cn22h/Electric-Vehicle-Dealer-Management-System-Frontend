export const useRoleBasedLayout = () => {
    const userRole = useCookie("role");

    const layoutName = computed(() => {
        const role = userRole.value?.toLowerCase();
        if (role === "dealer_staff" || role === "dealer_manager" ) {
            return "dealer-manager-layout";
        } else if (role === "admin") {
            return "admin";
        }
        else if (role === "evm_staff") {
            return "evm-staff-layout";
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
