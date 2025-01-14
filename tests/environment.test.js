// import Store from "electron-store";
//
// describe('Electron Store Set/Get Tests', () => {
//     it('should set and get a value from the store', async () => {
//         // Set a value in the Electron store
//         await browser.execute(() => {
//             const store = new Store(); // Initialize the Electron store
//             store.set('myKey', 'myValue'); // Set a value
//         });
//
//         // Get the value from the Electron store
//         const storedValue = await browser.execute(() => {
//             const store = new Store(); // Access the store
//             return store.get('myKey'); // Get the value
//         });
//
//         // Assert the stored value is correct
//         expect(storedValue).toEqual('myValue');
//     });
// });