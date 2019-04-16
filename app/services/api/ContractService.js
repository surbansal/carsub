class ContractService {
  constructor(api) {
    this.api = api;
  }

  getContractStatus(contractId) {
    return this.api.get(`/contracts/${contractId}/status`).then((response) => {
      return response;
    }).catch(() => {
      return null;
    });
  }

  generateSignUrl(contractId, subscriptionId, verification) {
    return this.api.get(`/contracts/${contractId}/sign-url?returnPage=${window.location.origin}/approval&subscription=${subscriptionId}&verification=${verification}`).then((response) => {
      return response.embeddedSignUrl;
    }).catch(() => {
      return null;
    });
  }

  generateMyAccountContractSignUrl(contractId) {
    return this.api.get(`/contracts/${contractId}/sign-url?returnPage=${window.location.origin}/my-account`).then((response) => {
      return response.embeddedSignUrl;
    }).catch(() => {
      return null;
    });
  }
}

export default ContractService;
