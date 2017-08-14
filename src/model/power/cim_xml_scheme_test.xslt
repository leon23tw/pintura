<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="1.0">

    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="/">
        <xsl:for-each select="xs:schema/xs:complexType">
        <xsl:sort select="@name"/>
            <p>
            <a href="#"
                class="w3-bar-item w3-button"
                type="file"
                id="upload-file"
                onclick="javascript:fileinput.click()">
                    <xsl:value-of select="@name" />
            </a>
            </p>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>

