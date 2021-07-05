import moment from 'moment';

export function useDistanceInWords() {
  return function (createdAt: number) {
    return moment.duration(moment(new Date()).diff(createdAt)).humanize();
  };
}
