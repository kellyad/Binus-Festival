--drop table #Enroll
select	distinct a.*, tglquery=getdate()
		into #Enroll
from	openquery(oracle11,'select * from  N_TRANSKUL_MHS_TANPA_JADWAL where institution=''BNS01'' and strm in (''1610'') and acad_career in (''RS1'',''BAS'') ') a

--drop table #Campus
select	*
		into #Campus
from	openquery(oracle11,'select * from N_L_STDNT_PERSONAL_DATA_VW where institution=''BNS01'' and acad_career in (''RS1'',''BAS'') ')

select	distinct a.institution, a.acad_career, c.education_lvl, a.strm, a.external_system_id, b.kdmtk, b.nmmtk, a.class_section, c.campus
		into #MtkCBPancasila
from	#Enroll a
join	master_matakuliah b on (case when len(a.kdmtk)=8 then b.subject+b.catalog_nbr else b.kdmtk end)=a.kdmtk
left	join #Campus c on a.external_system_id=c.external_system_id
where	b.kdmtk in ( select distinct kdmtk from udf_master_matakuliah('05'))
		and b.nmmtk like '%pancasila%'
order	by b.kdmtk, a.class_section, a.external_system_id

/* 
select distinct campus from #MtkCBPancasila
CSKMG - Kemanggisan
CSALS - Alam Sutra
*/

--CSKMG - Kemanggisan
--insert into tralokasievent_temp
select	distinct top 400
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Pancasila, Demokrasi dan Keadilan Sosial', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-03 00:00:00.000', eventenddate='2016-12-03 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='09:20:00', eventendtime='11:00:00',  --shift disesuaikan
		ruang='Auditorium', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=' ' ,
		Tipe='Mandatory', Penyelenggara='CBDC',
		PstSem1dan2='W', PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#MtkCBPancasila b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSKMG'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Pancasila%' and priod='2016' and kdsem='1' )


--CSALS - Alam Sutra
--insert into tralokasievent_temp
select	distinct top 150
		stsrc='A', tglpr=getdate(), usrpr=suser_sname(), tglup=null, usrup=null, priod='2016', kdsem='1',
		kdlokasi=case when b.campus='CSKMG' then '1' else '3' end, c.kdjur, c.kdstu, c.kdpmt, c.thang, b.external_system_id, 
		eventname='Pancasila dan Implikasinya bagi Character Building Generasi Muda Bangsa', --ganti nama event krn setiap shift beda topik
		eventstartdate='2016-12-03 00:00:00.000', eventenddate='2016-12-03 00:00:00.000', --ganti tanggal sesui dengan jadeal
		eventstarttime='07:20:00', eventendtime='09:00:00',  --shift disesuaikan
		ruang='A0505-06', --ruang disesuikan dengan yang diberikan
		kategori=null, kelas=null, keterangan=' ' ,
		Tipe='Mandatory', Penyelenggara='CBDC',
		PstSem1dan2='W', PstSem3dan4=null, PstSem5dan6=null, PstSem7Keatas=null, PstJurLain=null, KehadiranMtkTerkait=null,
		[E-Sertifikat]=null, PointSAT=null, NilaiTM=null, JnsAbsensi='Tapping', PIC=null, BinusianIDPIC=null
from	#MtkCBPancasila b 
join	msmhs1 c on b.external_system_id=c.nimhs
where	b.campus='CSALS'
		and b.external_system_id not in (
		select	distinct nimhs from	tralokasievent_temp where	stsrc<>'D' and eventname like '%Pancasila%' and priod='2016' and kdsem='1' )


begin tran update tralokasievent_temp set ruang='A0901-03' where	stsrc<>'D' and eventname like '%Pancasila%' and priod='2016' and kdsem='1' and kdlokasi='3' --commit