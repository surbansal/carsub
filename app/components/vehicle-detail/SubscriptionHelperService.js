class SubscriptionHelperService {
  static setIsSaving(component, isSaving) {
    component.setState({
      isSaving
    });
    component.props.onSaving({
      isSaving
    });
  }
}
export default SubscriptionHelperService;
