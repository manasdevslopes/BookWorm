export const snapshotToArray = snapShot => {
  let returnArr = [];

  snapShot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });
  return returnArr;
};
