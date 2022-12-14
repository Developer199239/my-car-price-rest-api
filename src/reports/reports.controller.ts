import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGurad } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ApprovedReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        return this.reportService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGurad)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
        return this.reportService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto){
        return this.reportService.changeApproval(parseInt(id),body.approved)
    }
}
