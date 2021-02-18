import Placer from '../components/Placer';


it('has prop "points" when initiated', () => {
    const placer = new Placer({});
    expect(placer.list).toEqual([]);
});
