import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Release } from '../shared/models/release';

export class Update {
  static readonly type = '[Releases] Update';

  constructor(public releases: Release[]) {}
}

export interface IReleasesStateModel {
  releases: Release[];
}

/* eslint-disable @typescript-eslint/member-ordering */
@State<IReleasesStateModel>({
  name: 'releases',
  defaults: {
    releases: []
  }
})
@Injectable()
export class ReleasesState {
  @Selector()
  static releases(state: IReleasesStateModel) {
    return state.releases;
  }

  @Action(Update)
  update(ctx: StateContext<IReleasesStateModel>, action: Update) {
    ctx.setState(state => ({
      ...state,
      releases: action.releases
    }));
  }
}
