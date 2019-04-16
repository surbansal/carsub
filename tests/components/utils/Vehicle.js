const Vehicle = {
  id: 1,
  publicId: '7cd1bb37-ad32-4620-bf63-86389f4afe34',
  vin: '4T1BF1FK3FU067663',
  configuration: {
    id: 1,
    exterior: {
      id: 1,
      name: 'White',
      type: 'WHITE'
    },
    interior: {
      id: 1,
      name: 'Black',
      materialType: 'CLOTH',
      colorType: 'DARK'
    },
    transmissionType: {
      id: 1,
      name: '6-Speed Automatic',
      type: 'AUTOMATIC'
    },
    model: {
      id: 1,
      name: 'Camry SE',
      year: 2015,
      manufacturer: {
        id: 1,
        name: 'Toyota',
        exteriors: [
          {
            id: 1,
            name: 'White',
            type: 'WHITE'
          },
          {
            id: 2,
            name: 'Silver',
            type: 'SILVER'
          },
          {
            id: 3,
            name: 'Black',
            type: 'BLACK'
          },
          {
            id: 4,
            name: 'Gray',
            type: 'GREY'
          },
          {
            id: 5,
            name: 'Blue',
            type: 'BLUE'
          }
        ],
        interiors: [
          {
            id: 1,
            name: 'Black',
            materialType: 'CLOTH',
            colorType: 'DARK'
          },
          {
            id: 2,
            name: 'Ash',
            materialType: 'CLOTH',
            colorType: 'DARK'
          },
          {
            id: 3,
            name: 'Latte',
            materialType: 'LEATHER',
            colorType: 'LIGHT'
          }
        ],
        engineTypes: [
          {
            id: 1,
            name: '2.5L V4',
            type: 'V4'
          }
        ],
        transmissionTypes: [
          {
            id: 1,
            name: '6-Speed Automatic',
            type: 'AUTOMATIC'
          }
        ]
      },
      estimatedMileage: '32 MPG',
      seatingCapacity: '5',
      horsePower: '178 hp / 170 ft-lbs torque',
      engineType: {
        id: 1,
        name: '2.5L V4',
        type: 'V4'
      }
    }
  }
};

export default Vehicle;
