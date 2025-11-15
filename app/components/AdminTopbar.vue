<template>
  <header class="header">
    <div class="header-search">
      <input
        type="search"
        class="search-input"
        placeholder="Tìm kiếm..."
        autocomplete="off"
      />
    </div>

    <div class="user-info">
      <div class="user-details">
        <p class="user-name">Admin User</p>
        <p class="user-role">EVM Staff</p>
      </div>
      <div class="user-avatar">A</div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: 72px;
}

/* SEARCH */
.header-search {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  background: #f9fafb;
}

.search-input:hover {
  border-color: #9ca3af;
  background: white;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: white;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* USER INFO */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px 6px 6px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f3f4f6;
}

.user-details {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
    min-height: auto;
  }

  .header-search {
    max-width: 100%;
    order: 2;
  }

  .user-info {
    order: 1;
    align-self: flex-end;
  }

  .user-details {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 16px;
  }
}
</style>
