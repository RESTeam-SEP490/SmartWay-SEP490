package com.resteam.smartway.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.Zone;
import com.resteam.smartway.repository.DiningTableRepository;
import com.resteam.smartway.repository.ZoneRepository;
import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.IsActiveUpdateDTO;
import com.resteam.smartway.service.mapper.DiningTableMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class DiningTableServiceImpl implements DiningTableService {

    private static final String ENTITY_NAME = "dining_table";

    private final DiningTableRepository diningTableRepository;

    private final ZoneRepository zoneRepository;

    private final DiningTableMapper diningTableMapper;

    @Override
    public Page<DiningTableDTO> loadDiningTablesWithSearch(Pageable pageable, String searchText, List<String> zoneIds, Boolean isActive) {
        if (searchText != null) searchText = searchText.toLowerCase();
        List<UUID> zoneUuidList = null;
        if (zoneIds != null && zoneIds.size() > 0) zoneUuidList =
            zoneIds.stream().map(c -> UUID.fromString(c)).collect(Collectors.toList());
        Page<DiningTable> diningTablePage = diningTableRepository.findWithFilterParams(searchText, zoneUuidList, isActive, pageable);

        return diningTablePage.map(item -> {
            DiningTableDTO diningTable = diningTableMapper.toDto(item);
            return diningTable;
        });
    }

    @Override
    @SneakyThrows
    public DiningTableDTO createDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = diningTableMapper.toEntity(diningTableDTO);
        if (diningTableDTO.getZone() != null) {
            UUID zoneId = diningTableDTO.getZone().getId();
            Zone zone = zoneRepository
                .findById(zoneId)
                .orElseThrow(() -> new BadRequestAlertException("Zone is not found", ENTITY_NAME, "idnotfound"));
            diningTable.setZone(zone);
        }
        diningTable.setIsFree(true);
        diningTable.setIsActive(true);

        return diningTableMapper.toDto(diningTableRepository.save(diningTable));
    }

    @Override
    @SneakyThrows
    public DiningTableDTO updateDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = diningTableRepository
            .findById(diningTableDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
        if (diningTableDTO.getZone() != null) {
            UUID zoneId = diningTableDTO.getZone().getId();
            Zone zone = zoneRepository
                .findById(zoneId)
                .orElseThrow(() -> new BadRequestAlertException("Zone is not found", ENTITY_NAME, "idnotfound"));
            diningTable.setZone(zone);
        }
        diningTable = diningTableMapper.toEntity(diningTableDTO);

        DiningTable result = diningTableRepository.save(diningTable);
        return diningTableMapper.toDto(result);
    }

    @Override
    public void deleteDiningTable(List<String> ids) {
        List<DiningTable> diningTableIdList = ids
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                return diningTableRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
            })
            .collect(Collectors.toList());
        diningTableRepository.deleteAll(diningTableIdList);
    }

    @Override
    public void updateIsActiveDiningTables(IsActiveUpdateDTO isActiveUpdateDTO) {
        List<DiningTable> diningTableList = isActiveUpdateDTO
            .getIds()
            .stream()
            .map(id -> {
                if (id == null) throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
                DiningTable diningTable = diningTableRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idnotfound"));
                diningTable.setIsActive(isActiveUpdateDTO.getIsActive());
                return diningTable;
            })
            .collect(Collectors.toList());
        diningTableRepository.saveAll(diningTableList);
    }

    @Override
    public Optional<DiningTableDTO> findById(UUID uuid) {
        Optional<DiningTable> diningTableOptional = diningTableRepository.findById(uuid);
        return diningTableOptional.map(diningTableMapper::toDto);
    }

    @Override
    public byte[] generatePdfForDiningTable(DiningTableDTO diningTableDTO) throws DocumentException {
        Document document = new Document(PageSize.A7, 12, 12, 12, 12);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Customize PDF styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BaseColor.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);

        document.open();

        // Add a title to the document
        Paragraph nameRestaurant = new Paragraph("SmartWay", titleFont);
        Paragraph address = new Paragraph("Address: FPT University", titleFont);
        Paragraph phone = new Paragraph("Phone: 0888666789", titleFont);
        Paragraph line = new Paragraph("----------------", titleFont);
        Paragraph timeIn = new Paragraph("TimeIn: ", headerFont);
        Paragraph timeOut = new Paragraph("TimeOut: " + getCurrentTime(), headerFont);
        Paragraph staff = new Paragraph("Staff: ", headerFont);
        nameRestaurant.setAlignment(Element.ALIGN_CENTER);
        address.setAlignment(Element.ALIGN_CENTER);
        phone.setAlignment(Element.ALIGN_CENTER);
        line.setAlignment(Element.ALIGN_CENTER);
        timeIn.setAlignment(Element.ALIGN_LEFT);
        timeOut.setAlignment(Element.ALIGN_LEFT);
        staff.setAlignment(Element.ALIGN_LEFT);
        document.add(nameRestaurant);
        document.add(address);
        document.add(phone);
        document.add(line);
        document.add(timeIn);
        document.add(timeOut);
        document.add(staff);

        document.add(Chunk.NEWLINE); // Add some space between title and table content

        // Add table content with headers and values in separate rows
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        // Header row with relative widths
        float[] columnWidths = { 50f, 20f, 30f }; // Adjust the percentages here
        table.setWidths(columnWidths);
        // Header row
        addHeaderWithStyle(table, "Dining Table ID", headerFont);
        addHeaderWithStyle(table, "Name", headerFont);
        addHeaderWithStyle(table, "Number of Seats", headerFont);

        // Data row
        addValueWithStyle(table, String.valueOf(diningTableDTO.getId()), normalFont);
        addValueWithStyle(table, diningTableDTO.getName(), normalFont);
        addValueWithStyle(table, String.valueOf(diningTableDTO.getNumberOfSeats()), normalFont);

        document.add(table);

        float spacingAfterTable = 10f; // Adjust the spacing as needed (in points)
        table.setSpacingAfter(spacingAfterTable);

        Paragraph subTotal = new Paragraph("SubTotal: ", headerFont);
        subTotal.setAlignment(Element.ALIGN_LEFT);
        document.add(subTotal);
        Paragraph total = new Paragraph("Total: ", headerFont);
        total.setAlignment(Element.ALIGN_LEFT);
        document.add(total);

        document.add(line);

        String imageUrl = "https://static.vecteezy.com/system/resources/previews/002/557/391/original/qr-code-for-scanning-free-vector.jpg";
        try {
            // Add an image from an online URL to the document
            Image logo = Image.getInstance(new URL(imageUrl));
            logo.scaleToFit(75f, 75f);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);

            float spacingBeforeImage = 0f; // Adjust the spacing as needed (in points)
            float spacingAfterImage = 0f; // Adjust the spacing as needed (in points)
            logo.setSpacingBefore(spacingBeforeImage);
            logo.setSpacingAfter(spacingAfterImage);

            Paragraph poweredBy = new Paragraph("Powered By SmartWay.website", titleFont);
            poweredBy.setAlignment(Element.ALIGN_CENTER);
            document.add(poweredBy);
        } catch (MalformedURLException e) {
            // Handle MalformedURLException
            System.err.println("MalformedURLException: Invalid URL format. Please check the URL.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        } catch (IOException e) {
            // Handle IOException
            System.err.println("IOException: There was an error fetching the image from the provided URL.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        } catch (BadElementException e) {
            // Handle BadElementException
            System.err.println("BadElementException: Error while adding the image to the PDF.");
            e.printStackTrace();
            // Return or throw an appropriate error message or perform error handling as needed.
        }

        document.close();

        return byteArrayOutputStream.toByteArray();
    }

    private static void addHeaderWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell headerCell = new PdfPCell(new Phrase(text, font));
        headerCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        headerCell.setBorderColorBottom(BaseColor.DARK_GRAY);
        headerCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        headerCell.setBorderWidthLeft(0f); // Remove left border
        headerCell.setBorderWidthRight(0f); // Remove right border
        headerCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        headerCell.setPaddingBottom(5f);
        table.addCell(headerCell);
    }

    private static void addValueWithStyle(PdfPTable table, String text, Font font) {
        PdfPCell valueCell = new PdfPCell(new Phrase(text, font));
        valueCell.setBorder(Rectangle.BOTTOM); // Show only the bottom border
        valueCell.setBorderColorBottom(BaseColor.BLACK);
        valueCell.setBorderWidthBottom(1f); // Set the thickness of the bottom border
        valueCell.setBorderWidthLeft(0f); // Remove left border
        valueCell.setBorderWidthRight(0f); // Remove right border
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        valueCell.setPaddingTop(5f);
        valueCell.setPaddingBottom(8f);
        table.addCell(valueCell);
    }

    private String getCurrentTime() {
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(now);
    }
}
