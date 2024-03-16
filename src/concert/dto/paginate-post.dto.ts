import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginationPostDto {
  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  //이전 마지막 데이터의 Id
  //이 프로퍼티에 입력된 Id 보다 높은 Id부터 값을 가져오기
  //   @Type(() => Number)
  //params에 들어간 값은 전부 string이 되는데, 그걸 Number 타입을 변환
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  //정렬
  //createdAt => 생성된 시간의 내림차/오름차 순으로 정렬
  @IsIn(['ASC', 'DESC']) //리스트에 있는 값들만 허용시킴
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';
  //오름차순만 가정했음,
  //'ASC' = 'ASC' 라는 방식으로 디폴트를 넣어줬습니다

  //몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 2; //데이터수가 크지않아서 2개만 받겠음!
}
