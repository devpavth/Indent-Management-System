import { Component, Input, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.css',
})
export class EditListComponent implements OnInit {
  projectList: any;
  assProjListIds: any;
  @Input() id: string = '';
  constructor(private readonly branchService: BranchService) {}
  ngOnInit(): void {}
  fetchDepart() {}
  addProject(data: any) {}
  deleteProject(id: any) {}
  onSubmit() {}
}
