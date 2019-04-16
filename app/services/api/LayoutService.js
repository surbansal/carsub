class LayoutService {
  static isMobile() {
    if (window.innerWidth > 980) {
      return false;
    }
    return true;
  }
}

export default LayoutService;
