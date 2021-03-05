import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterProgramGroup' })
export class FilterProgramGroupPipe implements PipeTransform {
  transform(roleList: any[], programGroup: string) {
    return roleList.filter(item => item.programGroupId == programGroup);
  }
}

@Pipe({ name: 'filterDistinctProgramGroup' })
export class FilterDistinctProgramGroupPipe implements PipeTransform {
  transform(roleList: any[]) {
    const map = new Map();
    const result: any[] = [];
    for (const item of roleList) {
      if (!map.has(item.programGroupId) && item.url != null) {
        map.set(item.programGroupId, item);
        result.push(item);
      }
    }
    return result;
  }
}

