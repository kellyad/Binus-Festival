/*
--drop table #Enroll
select	distinct a.*, tglquery=getdate()
		into #Enroll
from	openquery(oracle11,'select * from  N_TRANSKUL_MHS_TANPA_JADWAL where institution=''BNS01'' and strm in (''1610'') and acad_career in (''RS1'',''BAS'') ') a
*/

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

--drop table #EN01BP01EN02
--induk
select	distinct a.institution, a.acad_career, c.education_lvl, a.strm, a.external_system_id, b.kdmtk, b.nmmtk, a.class_section, c.campus
		into #EN01BP01EN02
from	#Enroll a
join	master_matakuliah b on (case when len(a.crse_code)=8 then b.subject+b.catalog_nbr else b.kdmtk end)=a.crse_code
left	join #Campus c on a.external_system_id=c.external_system_id
where	a.crse_code in ( select distinct kdmtk from #MtkENBP )

--drop table #AllEN01BP01EN02
select	* into #AllEN01BP01EN02 from #EN01BP01EN02
union
--dummy
select	distinct a.institution, a.acad_career, c.education_lvl, a.strm, a.external_system_id, b.kdmtk, b.nmmtk, a.class_section, c.campus
from	#Enroll a
join	master_matakuliah b on (case when len(a.crse_code)=8 then b.subject+b.catalog_nbr else b.kdmtk end)=a.crse_code
left	join #Campus c on a.external_system_id=c.external_system_id
where	rtrim(a.crse_code)+rtrim(a.class_section)  in ( 
			select	rtrim(kdmtk)++rtrim(kelas)
			from	master_jadwal_kuliah
			where	stsrc<>'D' and priod='2016' and kdsem='1' and kelasmtkstr is not null
					and kelasmtkstr in ( select distinct rtrim(kdmtk)+rtrim(class_section) from  #EN01BP01EN02 )
		)


--drop table #DataInput
select	*
		into #DataInput
from	#AllEN01BP01EN02
where	rtrim(external_system_id)+rtrim(class_section) in (select	rtrim(external_system_id)+min(class_section) from #AllEN01BP01EN02 group by external_system_id)


select	class_section, kdmtk, nmmtk, jumlah=count(distinct external_system_id)
from	#DataInput
where	campus='CSKMG'
group	by class_section, nmmtk, kdmtk
order	by class_section, kdmtk

select	class_section, kdmtk, nmmtk, jumlah=count(distinct external_system_id)
from	#DataInput
where	campus='CSALS'
group	by class_section, nmmtk, kdmtk
order	by class_section, kdmtk


/* Contributor */
--CSKMG - Kemanggisan
--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Festivals of Innovation and Enterprise Week', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='16:00:00',  --shift disesuaikan
		ruang='Food Court', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 2', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 3', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 4', --ruang disesuikan dengan yang diberikan
		--ruang='Parkir Selatan, samping admisi', --ruang disesuikan dengan yang diberikan
		kategori='Contributor', kelas=b.class_section, keterangan=rtrim(b.kdmtk),
		Tipe='Mandatory', Penyelenggara='BEC',
		PstSem1dan2=null, PstSem3dan4='W', PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#DataInput b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSKMG'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor' )
		and rtrim(b.kdmtk)+rtrim(b.class_section) in ('EN002L001','Z1146L001','Z1146L101','Z1146L201','Z1146L601','Z1146L701','Z1146L801','Z1146L901','EN002LA01','Z1056LA01','Z1146LA01','Z1056LA02','Z1146LA02','Z1056LA03',
			'Z1146LA03','EN001LA04','Z1056LA04','Z1146LA04','Z1056LA05') --1
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1056LA07','Z1056LA08','Z1056LA11','EN001LA12','Z1056LA12','Z1146LA13','Z1056LA14','Z1146LA14','EN002LA16','Z1056LA16','Z1146LA16','EN002LA21','J0814LA21','J0852LA21','J1222LA21',
		--	'J1653LA21','J1673LA21','Z0571LA21','Z0747LA21','Z0795LA21') --2
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1056LA21','EN002LA22','Z1056LA22','Z1056LA23','Z1146LA23','EN002LA26','Z1280LA27','Z1056LA32','Z1146LA32','EN001LA33','Z1056LA33',
		--	'Z1146LA33','Z1056LA34','Z1146LA34','Z1056LA35','Z1146LA35','Z1056LA40','D1252LA41','Z1056LA41') --3
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1263LA41','Z0771LA43','Z1056LA43','R1092LA44','Z0589LA44','Z0603LA44','Z0645LA44','Z1056LA44','Z0149LA45','Z1056LA51','Z1056LA52','Z1146LA53',
		--	'Z1056LA56','Z1146LA56','EN001LA61','Z1056LA61','Z1056LA62','Z1146LA62','EN002LA63','Z1056LA63') --4
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LA63','Z1146LA64','Z1238LA64','Z1056LA65','Z1146LA65','Z1056LA66','Z1146LA66','EN002LB01','Z1056LB01','Z1146LB01','Z1056LB02',
		--	'Z1146LB02','J0692LB04','Z1056LB04','Z1146LB04','Z1056LB07','Z1056LB11') --5



--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Festivals of Innovation and Enterprise Week', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='16:00:00',  --shift disesuaikan
		--ruang='Food Court', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 2', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 3', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 4', --ruang disesuikan dengan yang diberikan
		ruang='Parkir Selatan, samping admisi', --ruang disesuikan dengan yang diberikan
		kategori='Contributor', kelas=b.class_section, keterangan=rtrim(b.kdmtk) ,
		Tipe='Mandatory', Penyelenggara='BEC',
		PstSem1dan2=null, PstSem3dan4='W', PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#AllEN01BP01EN02 b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSKMG'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor' )
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LB11','EN002LB16','EN002LB21','J0844LB21','J1665LB21','Z0571LB21','Z0795LB21','Z1056LB21','Z1056LB23','Z1146LB23','EN002LB26','Z1056LB26',
		--'Z1056LB32','Z1146LB32','Z1056LB33','Z1146LB33','Z1056LB34') --1
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LB34','EN002LB35','Z1056LB35','Z1146LB35','D1264LB41','Z1056LB41','Z1263LB41','Z0771LB43','Z1056LB43','Z1056LB44',
		--'Z1056LB51','Z1056LB52','Z1056LB53','Z1146LB53','Z1056LB56','Z1146LB56','Z1056LB61','Z1056LB62') --2
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LB62','EN002LB64','Z1146LB64','Z1238LB64','Z1146LB65','Z1056LB66','Z1146LB66','EN002LC01','Z1056LC01','Z1056LC04','Z1146LC04',
		--'Z1056LC11','Z1146LC11','J0844LC21','J1665LC21','Z0795LC21','Z1056LC21','Z1146LC23','Z1056LC26','Z1056LC32') --3
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LC32','Z1056LC33','Z1146LC33','Z1146LC34','Z1056LC35','Z1146LC35','D1264LC41','Z1056LC41','Z1056LC44','Z1056LC53',
		--'Z1146LC53','Z1056LC56','Z1056LC61','Z1056LC62','Z1146LC64','Z1238LC64','Z1056LC66') --4
		and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LC66','EN002LD01','Z1056LD01','Z1056LD11','Z1146LD11','EN002LD21','Z0571LD21','Z1056LD21','Z1056LD32','Z1146LD32',
		'Z1056LD33','Z1146LD33','Z1056LD41','Z1056LD53','Z1146LD53') --5





--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Festivals of Innovation and Enterprise Week', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-03 00:00:00.000', eventenddate='2016-12-03 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='16:00:00',  --shift disesuaikan
		--ruang='Food Court', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 2', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 3', --ruang disesuikan dengan yang diberikan
		--ruang='Balkon Lt. 4', --ruang disesuikan dengan yang diberikan
		ruang='Parkir Selatan, samping admisi', --ruang disesuikan dengan yang diberikan
		kategori='Contributor', kelas=b.class_section, keterangan=rtrim(b.kdmtk),
		Tipe='Mandatory', Penyelenggara='BEC',
		PstSem1dan2=null, PstSem3dan4='W', PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#AllEN01BP01EN02 b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSKMG'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor' )
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1056LD56','Z1146LD64','Z1056LD66','Z1146LD66','EN002LE01','Z1056LE01','Z1056LE11','Z0571LE21','Z1056LE21','Z1056LE51',
		--'Z1056LE52','Z1056LE53','Z1056LE56','Z1056LE66','Z1146LE66') --1
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('EN002LF01','Z1056LF01','Z1056LF11','Z1146LF11','Z1056LF21','Z1056LF51','Z1056LF66','Z1146LF66','Z1056LG01','EN002LG11',
		--'Z1056LG11','Z1146LG11','Z1056LG21','Z1056LG51','Z1146LG53','Z1056LH01','Z1056LH11') --2
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LH11','Z1056LH21','Z1056LH53','Z1146LH53','Z1056LI01','Z1146LI01','Z1056LI11','Z1146LI11','Z1056LI21','Z1056LI53',
		--'Z1146LI53','EN002LJ01','Z1056LJ01','Z1146LJ01','Z1056LJ11','Z1146LJ11','Z1056LJ53') --3
		--and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LJ53','Z1056LK01','Z1146LK01','Z1146LK11','Z1056LK53','Z1146LK53','Z1056LL01','Z1146LL01','EN002LL11','Z1146LL11',
		--'EN002LM01','Z1056LM01','Z1146LM01','Z1056LM21','Z1056LN01','Z1146LN01','Z1056LO01','Z1056LO11') --4
		and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LO11','Z1056LP01','Z1056LP11','Z1146LP11','Z1056LQ01','Z1146LQ11','Z1056LQ21','Z1056LR01','Z1146LR01','Z1146LR11',
		'Z1056LR21','Z1146LS01','Z1056LS21','Z1146LT01','Z1056LT21','Z1056LU21','Z1056LV21','Z1146LX01','EN002LY01','Z1146LY01') --5



--CSALS - Alam Sutra
--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Festivals of Innovation and Enterprise Week', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='16:00:00',  --shift disesuaikan
		ruang='Lobby', --ruang disesuikan dengan yang diberikan
		kategori='Contributor', kelas=b.class_section, keterangan=rtrim(b.kdmtk),
		Tipe='Mandatory', Penyelenggara='BEC',
		PstSem1dan2=null, PstSem3dan4='W', PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#AllEN01BP01EN02 b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSALS'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor' )
		and rtrim(b.kdmtk)+rtrim(b.class_section) in 
		('EN002LA24','Z1056LA24','Z1190LA24','EN002LA25','Z1056LA25','Z1056LA29','Z1056LA46','Z1146LA46','Z1056LA53','Z1056LA55','Z1146LA55','EN002LB24','Z1056LB24',
		'Z1190LB24','Z1056LB46','Z1056LB55','Z1146LB55','Z1146LB63','Z1146LC01','EN002LC02','Z1056LC02','Z1146LC02','Z1056LC23','EN002LC24','Z1056LC24','Z1190LC24','Z1056LC51',
		'Z1056LC63','Z1146LD01','Z0795LD21','Z1056LD23','Z1146LD23','EN002LD24','Z1056LD24','Z1190LD24','Z1056LD52','Z1146LE01','Z1146LE11','Z1146LE23','EN002LE24','Z1056LE24',
		'Z1190LE24','Z1056LE32','Z1146LE32','Z1056LE33') --1		

--insert into tralokasievent_temp
select	distinct 
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Festivals of Innovation and Enterprise Week', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='16:00:00',  --shift disesuaikan
		ruang='Lobby', --ruang disesuikan dengan yang diberikan
		kategori='Contributor', kelas=b.class_section, keterangan=rtrim(b.kdmtk) ,
		Tipe='Mandatory', Penyelenggara='BEC',
		PstSem1dan2=null, PstSem3dan4='W', PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#AllEN01BP01EN02 b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSALS'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor' )
		and rtrim(b.kdmtk)+rtrim(b.class_section) in ('Z1146LE33','Z1146LE53','J1665LF21','Z0571LF21','Z0795LF21','J1542LF24','Z1056LF24','Z1190LF24','Z1056LF32','Z1056LF33',
		'Z1146LF33','Z1056LF53','Z1146LF53','Z1146LG01','J1653LG21','Z0571LG21','Z1056LG24','Z1056LG32','Z1146LG32','Z1056LG53','Z1146LH01','Z1056LH24','Z1056LH51','Z1056LI24',
		'Z1056LJ21','Z1056LJ24','Z1056LK11','Z1056LK21','Z1056LK24','Z1056LL11','Z1056LL21','Z1146LL53','Z1056LM11','Z1146LM11','Z1056LM53','Z1146LM53','Z1056LN11','Z1146LN11',
		'Z1056LN53','Z1146LN53','Z1146LO01','Z1056LO53','Z1146LO53','Z1056LS01','Z1056LT01','Z1146LT11','Z1056LU01','Z1056LV01','Z1056LW01','Z1056LW21','Z1056LX01','EN001LX21',
		'Z1056LX21','Z1056LY01','Z1056LY21','Z1056LZ21') --1
		
--rollback
select	distinct * 
from	tralokasievent_temp 
--begin tran update tralokasievent_temp  set eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000'
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Contributor'
		and kelas in ('CA23','CA24','CA25','CA46','CA55','CB02' ) and kdlokasi='3'
--commit

/* Visitor - Entrepreneurial Excellence: Entrepreneur Week */
--Kemanggisan
/* Day 1 */
--drop table #VisitorDay1
select	distinct * 
		into #VisitorDay1
from	tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(kategori)='Contributor'
		and kdlokasi='1' and eventstartdate in ('2016-12-02 00:00:00.000','2016-12-03 00:00:00.000')

update	#VisitorDay1 set tglpr=getdate(), usrpr=suser_sname(), eventname='Entrepreneurial Excellence: Entrepreneur Week', eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', kategori='Visitor', keterangan='Visitor'

--insert into tralokasievent_temp
select * from #VisitorDay1

/* Day 2 */
--drop table #VisitorDay2
select	distinct * 
		into #VisitorDay2
from	tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(kategori)='Contributor'
		and kdlokasi='1' and eventstartdate in ('2016-12-01 00:00:00.000','2016-12-03 00:00:00.000')

update	#VisitorDay2 set tglpr=getdate(), usrpr=suser_sname(), eventname='Entrepreneurial Excellence: Entrepreneur Week', eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', kategori='Visitor', keterangan='Visitor'

--insert into tralokasievent_temp
select * from #VisitorDay2

/* Day 3 */
--drop table #VisitorDay3
select	distinct * 
		into #VisitorDay3
from	tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(kategori)='Contributor'
		and kdlokasi='1' and eventstartdate in ('2016-12-01 00:00:00.000','2016-12-02 00:00:00.000')

update	#VisitorDay3 set tglpr=getdate(), usrpr=suser_sname(), eventname='Entrepreneurial Excellence: Entrepreneur Week', eventstartdate='2016-12-03 00:00:00.000', eventenddate='2016-12-03 00:00:00.000', kategori='Visitor', keterangan='Visitor'

--insert into tralokasievent_temp
select * from #VisitorDay3
		
--Alam Sutra
/* Day 1 */
--drop table #VisitorDay1Alsut
select	distinct * 
		into #VisitorDay1Alsut
from	tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(kategori)='Contributor'
		and kdlokasi='3' and eventstartdate in ('2016-12-02 00:00:00.000')

update	#VisitorDay1Alsut set tglpr=getdate(), usrpr=suser_sname(), eventname='Entrepreneurial Excellence: Entrepreneur Week', eventstartdate='2016-12-01 00:00:00.000', eventenddate='2016-12-01 00:00:00.000', kategori='Visitor', keterangan='Visitor'

--insert into tralokasievent_temp
select * from #VisitorDay1Alsut

/* Day 2 */
--drop table #VisitorDay2Alsut
select	distinct * 
		into #VisitorDay2Alsut
from	tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Festivals of Innovation and Enterprise Week%' and priod='2016' and kdsem='1'
		and rtrim(kategori)='Contributor'
		and kdlokasi='3' and eventstartdate in ('2016-12-01 00:00:00.000')

update	#VisitorDay2Alsut set tglpr=getdate(), usrpr=suser_sname(), eventname='Entrepreneurial Excellence: Entrepreneur Week', eventstartdate='2016-12-02 00:00:00.000', eventenddate='2016-12-02 00:00:00.000', kategori='Visitor', keterangan='Visitor'

--insert into tralokasievent_temp
select * from #VisitorDay2Alsut


select	* 
from	tralokasievent_temp 
--begin tran delete tralokasievent_temp 
where	stsrc<>'D' and eventname like '%Entrepreneurial Excellence: Entrepreneur Week%' and priod='2016' and kdsem='1'
		and rtrim(keterangan)='Visitor' and nimhs='1801373920'



select	*
from	tralokasievent_temp
where	priod='2015' and kdsem='2' and eventname like '%Business Plan Competition%'




select * from tralokasievent_temp where priod='2015' and kdsem='2' and eventname='Festivals of Innovation and Enterprise Week'


select	* from #AllEN01BP01EN02 where class_section='CB53'

/*
select kdmtk='ENTR6003' into #MtkENBP 
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='PSYC6053'
Insert into #MtkENBP select kdmtk='BUSS6012'
Insert into #MtkENBP select kdmtk='ISYS6163'
Insert into #MtkENBP select kdmtk='MGMT6051'
Insert into #MtkENBP select kdmtk='DSGN6010'
Insert into #MtkENBP select kdmtk='ARCH6072'
Insert into #MtkENBP select kdmtk='ARCH6071'
Insert into #MtkENBP select kdmtk='CIVL6066'
Insert into #MtkENBP select kdmtk='LANG6034'
Insert into #MtkENBP select kdmtk='MGMT6049'
Insert into #MtkENBP select kdmtk='FINC6036'
Insert into #MtkENBP select kdmtk='MKTG6036'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6003'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='ENTR6004'
Insert into #MtkENBP select kdmtk='D1264'
Insert into #MtkENBP select kdmtk='J1653'
Insert into #MtkENBP select kdmtk='J1673'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
Insert into #MtkENBP select kdmtk='EN002'
*/