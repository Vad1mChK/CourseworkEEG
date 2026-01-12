export const sumBy = <T>(arr: T[], numberGetter: (item: T) => number): number =>
    arr.reduce((acc, item) => acc + numberGetter(item), 0);