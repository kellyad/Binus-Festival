--drop table #Enroll
select * into #Enroll
from openquery(oracle11, 
'with acad_prog as(
    select a.emplid,a.acad_career,a.campus from ps_acad_prog a
    where a.stdnt_car_nbr = (select max(aa.stdnt_car_nbr) from ps_acad_prog aa where aa.emplid=a.emplid and aa.acad_career in (''RS1'',''BAS''))
    and a.effdt = (select max(aa.effdt) from ps_acad_prog aa where aa.emplid=a.emplid and aa.stdnt_car_nbr=a.stdnt_car_nbr and aa.effdt<=sysdate)
    and a.effseq= (select max(aa.effseq) from ps_acad_prog aa where aa.emplid=a.emplid and aa.stdnt_car_nbr=a.stdnt_car_nbr and aa.effdt=a.effdt)  
)
select a.institution, AP.acad_career, a.strm, a.emplid,c.external_system_id, b.crse_id,a.class_nbr,
       CASE WHEN LENGTH (b.SUBJECT || TRIM (b.CATALOG_NBR)) = 8 THEN b.SUBJECT || b.CATALOG_NBR
       ELSE b.SUBJECT || SUBSTR ((''0000'' || TRIM (b.CATALOG_NBR)),(LENGTH (''0000'' || TRIM (b.CATALOG_NBR))) - (4 - LENGTH (b.SUBJECT)),4)
                   END AS CRSE_CODE,
       crse_grade_input, B.CLASS_SECTION , A.GRADING_BASIS_ENRL, AP.campus
from ps_stdnt_enrl a
JOIN PS_CLASS_TBL B 
    ON B.CLASS_NBR = A.CLASS_NBR AND A.STRM = B.STRM AND A.ACAD_CAREER = B.ACAD_CAREER
JOIN PS_EXTERNAL_SYSTEM C
    ON A.EMPLID = C.EMPLID 
    AND EXTERNAL_SYSTEM = ''NIM'' AND C.EFFDT = (SELECT MAX(EFFDT) FROM PS_EXTERNAL_SYSTEM WHERE EMPLID = C.EMPLID AND EXTERNAL_SYSTEM = ''NIM'')
JOIN acad_prog AP on AP.emplid=a.emplid and AP.acad_career=a.acad_career
where a.strm = 1610 and
 a.institution=''BNS01'' and
 a.stdnt_enrl_status = ''E'' and a.acad_career = ''RS1'' and a.grading_basis_enrl != ''NON''  --and a.ACAD_PROG<>''KBMGT''
')

--drop table #Campus
select	*
		into #Campus
from	openquery(oracle11,'select * from N_L_STDNT_PERSONAL_DATA_VW where institution=''BNS01'' and acad_career in (''RS1'',''BAS'') ')

--drop table #CareerSeminar
select	distinct a.institution, a.acad_career, c.education_lvl, a.strm, a.external_system_id, b.kdmtk, b.nmmtk, a.class_section, c.campus, c.fakultas
		into #CareerSeminar
from	#Enroll a
join	master_matakuliah b on (case when len(a.crse_code)=8 then b.subject+b.catalog_nbr else b.kdmtk end)=a.crse_code
left	join #Campus c on a.external_system_id=c.external_system_id
left	join msmhs1 d on a.external_system_id=d.nimhs
where	a.external_system_id in ( select distinct nimhs from tralokasievent_temp where stsrc<>'D' and priod='2016' and kdsem='1' )
		and c.acad_year<='2013'

--drop table #mhsambilOracle
select * into #mhsambilOracle from openquery(oracle11,'select * from n_l_stdnt_personal_data_vw where acad_career in (''RS1'',''BAS'') and institution=''BNS01'' ')

--drop table #acad_plan
select * into #acad_plan from openquery(oracle11,'select * from ps_acad_plan_tbl where upper(descr) like ''%INTR%'' ') 


--drop table #mhs3plus1
select * into #mhs3plus1 from msmhs1 where 
binusid in (select distinct binusianid from #mhsambilOracle where ACAD_PLAN in (select distinct rtrim(ACAD_PLAN) from #acad_plan )) 
union
select * from msmhs1 where 
binusid in (select distinct binusianid from #mhsambilOracle where rtrim(ACAD_PROG) in ('DBCSI','DBCMI')) 


select	fakultas, campus, jumlahmhs=count(distinct external_system_id)
from	#CareerSeminar
where	external_system_id not in ( select distinct nimhs from #mhs3plus1 where kdjur='61' )
group	by fakultas, campus
order	by campus, fakultas

--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Career Seminar', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='09:20:00', eventendtime='11:00:00',  --shift disesuaikan
		ruang='Aula', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=null,
		Tipe='Mandatory', Penyelenggara='Jurusan',
		PstSem1dan2=null, PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas='W', PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#CareerSeminar b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.external_system_id not in ( select distinct nimhs from #mhs3plus1 where kdjur='61' 
		union
		select distinct nimhs from tralokasievent_temp where stsrc<>'D' and priod='2016' and kdsem='1' and eventname like '%Career Seminar%')
		and b.campus='CSKMG'
		and rtrim(b.fakultas)='Faculty of Humanities'

--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Career Seminar', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='15:20:00', eventendtime='17:00:00',  --shift disesuaikan
		ruang='Auditorium', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=null,
		Tipe='Mandatory', Penyelenggara='Jurusan',
		PstSem1dan2=null, PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas='W', PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#CareerSeminar b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.external_system_id not in ( select distinct nimhs from #mhs3plus1 where kdjur='61' 
		union
		select distinct nimhs from tralokasievent_temp where stsrc<>'D' and priod='2016' and kdsem='1' and eventname like '%Career Seminar%')
		and b.campus='CSKMG'
		and rtrim(b.fakultas)='School of Information Systems'


--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Career Seminar', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='11:20:00', eventendtime='13:00:00',  --shift disesuaikan
		ruang='A1002-03', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=null,
		Tipe='Mandatory', Penyelenggara='Jurusan',
		PstSem1dan2=null, PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas='W', PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#CareerSeminar b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.external_system_id not in ( select distinct nimhs from #mhs3plus1 where kdjur='61' 
		union
		select distinct nimhs from tralokasievent_temp where stsrc<>'D' and priod='2016' and kdsem='1' and eventname like '%Career Seminar%')
		and b.campus='CSALS'
		and rtrim(b.fakultas)='School of Business Management'

--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Career Seminar', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='13:20:00', eventendtime='15:00:00',  --shift disesuaikan
		ruang='A1002-03', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=null,
		Tipe='Mandatory', Penyelenggara='Jurusan',
		PstSem1dan2=null, PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas='W', PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#CareerSeminar b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.external_system_id not in ( select distinct nimhs from #mhs3plus1 where kdjur='61' 
		union
		select distinct nimhs from tralokasievent_temp where stsrc<>'D' and priod='2016' and kdsem='1' and eventname like '%Career Seminar%')
		and b.campus='CSALS'
		and rtrim(b.fakultas)='School of Information Systems'