import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  async create(reportData: CreateReportDto, user: User) {
    const report = this.repo.create(reportData);
    report.user = user;

    return await this.repo.save(report);
  }

  async approveReport(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);

    if (!report) {
      throw new NotFoundException('report not found!');
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
