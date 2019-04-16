class AdminModalService {
  static showModalContent(content) {
    AdminModalService.content = content;
    if (AdminModalService.listeners) {
      AdminModalService.listeners.forEach(fn => fn(AdminModalService.content));
    }
  }

  static onChange(fn) {
    AdminModalService.listeners = AdminModalService.listeners || [];
    AdminModalService.listeners.push(fn);
  }
}

export default AdminModalService;
