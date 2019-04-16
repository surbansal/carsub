import {Api} from '../../config/ApplicationContext';
import ZipCodeService from '../../services/api/ZipCodeService';

class SubscriptionPriceCalculationService {
  static getTotalPrice(vehicle, zipCode, mileagePackage) {
    let zipToUse = ZipCodeService.extractZipCode();
    if (zipCode) {
      zipToUse = zipCode;
    }
    return Api.get(`/tax/zip/${zipToUse}`).then((resp) => {
      const taxRate = resp.estimatedCombinedRate;
      return this.calculatePrice(taxRate, vehicle, mileagePackage);
    }).catch(() => {
      const taxRate = 0;
      return this.calculatePrice(taxRate, vehicle, mileagePackage);
    });
  }
  static calculatePrice(taxRate, vehicle, mileagePackage) {
    const selectedPrice = vehicle.prices.find((price) => {
      if (price.mileagePackage && mileagePackage) {
        return price.mileagePackage.id === mileagePackage.id;
      }
      return price.mileagePackage === mileagePackage;
    });
    const monthlyBaseCost = selectedPrice.basePrice;
    const mileagePackageCost = selectedPrice.mileagePackagePrice;
    const subTotal = monthlyBaseCost + mileagePackageCost;
    const tax = (taxRate * subTotal);
    const total = subTotal + tax;
    return total;
  }
}

export default SubscriptionPriceCalculationService;
