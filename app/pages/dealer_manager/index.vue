<template>
    <!-- <EVMStaffLayout> -->
    <div class="dealer-manager-dashboard">
        <!-- Header -->
        <div class="dashboard-header">
            <h1>DEALER MANAGER</h1>
            <p>Welcome to Electric Vehicle Management System</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-info">
                    <h3>Tồn kho</h3>
                    <p class="stat-number">247</p>
                    <span class="stat-trend positive">+12%</span>
                </div>
            </div>

            <NuxtLink to="/dealer_manager/coordination" class="stat-card">
                    <div class="stat-icon"></div>
                    <div class="stat-info">
                        <h3>Yêu cầu điều phối xe</h3>
                        <p class="stat-number">56</p>
                        <span class="stat-trend warning">+5%</span>
                    </div>
                    </NuxtLink>

            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-info">
                    <h3>Test Drives</h3>
                    <p class="stat-number">34</p>
                    <span class="stat-trend positive">+8%</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-info">
                    <h3>Revenue</h3>
                    <p class="stat-number">$1.2M</p>
                    <span class="stat-trend positive">+15%</span>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
                <button class="action-btn" @click="navigateTo('vehicles')">
                    <span class="action-icon"></span>
                    <span>Manage Vehicles</span>
                </button>
                <button class="action-btn" @click="navigateTo('user/orders')">
                    <span class="action-icon"></span>
                    <span>Process Orders</span>
                </button>
                <button class="action-btn" @click="navigateTo('pricing')">
                    <span class="action-icon"></span>
                    <span>Update Pricing</span>
                </button>
                <button class="action-btn" @click="navigateTo('test-drive')">
                    <span class="action-icon"></span>
                    <span>Schedule Test Drives</span>
                </button>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
            <h2>Recent Activity</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">✅</div>
                    <div class="activity-content">
                        <p><strong>New order</strong> received for Tesla Model 3</p>
                        <span class="activity-time">2 minutes ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">🚙</div>
                    <div class="activity-content">
                        <p><strong>Vehicle added:</strong> Ford Mustang Mach-E</p>
                        <span class="activity-time">1 hour ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">🧪</div>
                    <div class="activity-content">
                        <p><strong>Test drive scheduled</strong> for Hyundai Ioniq 5</p>
                        <span class="activity-time">3 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- </EVMStaffLayout> -->
</template>

<script setup>
// Thử cách này - bỏ comment và dùng trực tiếp
definePageMeta({
    layout: "dealer-manager-layout",
});

// Hoặc thử với tên khác
// definePageMeta({
//   layout: 'EVMStaffLayout'
// })
</script>

<style scoped>
.dealer-manager-dashboard {
    padding: 20px 0;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 40px;
}

.dashboard-header h1 {
    color: #2d3748;
    margin-bottom: 10px;
    font-size: 2.5rem;
}

.dashboard-header p {
    color: #718096;
    font-size: 1.1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    font-size: 3rem;
}

.stat-info h3 {
    margin: 0 0 10px 0;
    color: #4a5568;
    font-size: 1rem;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2d3748;
    margin: 0 0 5px 0;
}

.stat-trend {
    font-size: 0.9rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
}

.stat-trend.positive {
    background: #c6f6d5;
    color: #22543d;
}

.stat-trend.warning {
    background: #fed7d7;
    color: #742a2a;
}

.quick-actions {
    margin-bottom: 40px;
}

.quick-actions h2 {
    color: #2d3748;
    margin-bottom: 20px;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.action-btn {
    background: white;
    border: 2px solid #e2e8f0;
    padding: 25px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    font-weight: 600;
    color: #4a5568;
}

.action-btn:hover {
    border-color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
    font-size: 2.5rem;
}

.recent-activity h2 {
    color: #2d3748;
    margin-bottom: 20px;
}

.activity-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.3s;
}

.activity-item:hover {
    background-color: #f7fafc;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    font-size: 1.5rem;
}

.activity-content p {
    margin: 0 0 5px 0;
    color: #2d3748;
}

.activity-time {
    color: #718096;
    font-size: 0.9rem;
}
</style>
