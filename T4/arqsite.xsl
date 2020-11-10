<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html lang="pt">
                <head>
                    <title>Arqueossítios do Noroeste Português</title>
                </head>
                <body>
                    <h2>Arqueossítios do Noroeste Português</h2>
                    <h3>Índice de Arqueossítios</h3>
                    <ol>
                        <xsl:apply-templates select="//ARQELEM" mode="indice">
                            <xsl:sort select="IDENTI"/>
                        </xsl:apply-templates>
                    </ol>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    
    
    <!-- Templates de índice .................................... -->
    
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="{generate-id()}" href="http://localhost:7777/arqs/{generate-id()}">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <!-- Templates para o conteúdo .............................. -->

    <xsl:template match="ARQELEM">
        <xsl:result-document href="site/arqs/arq-{generate-id()}.html">
            <html lang="pt">
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <xsl:apply-templates/>
                    <address>
                        [<a href="http://localhost:7777/#{generate-id()}">Voltar à Home</a>]
                    </address>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
    <xsl:template match="TIPO">
        <p><b>TIPO: </b><xsl:value-of select="@ASSUNTO"/></p>
    </xsl:template>
    
    <xsl:template match="IDENTI">
        <p><b>IDENTI: </b><xsl:value-of select="."/></p>
    </xsl:template>

    <xsl:template match="IMAGEM">
        <p>
            <b>IMAGEM:</b><br/>
            <img src="{@NOME}" alt="{@NOME}"/>
        </p>
    </xsl:template>
    
    <xsl:template match="DESCRI">
        <p><b>DESCRI: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="CRONO">
        <p><b>CRONO: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LUGAR">
        <p><b>LUGAR: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="FREGUE">
        <p><b>FREGUE: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="CONCEL">
        <p><b>CONCEL: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="CODADM">
        <p><b>CODADM: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LATITU">
        <p><b>LATITU: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LONGIT">
        <p><b>LONGIT: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="ALTITU">
        <p><b>ALTITU: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="ACESSO">
        <p><b>ACESSO: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="QUADRO">
        <p><b>QUADRO: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="TRAARQ">
        <p><b>TRAARQ: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DESARQ">
        <p><b>DESARQ: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="INTERP">
        <p><b>INTERP: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DEPOSI">
        <p><b>DEPOSI: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="INTERE">
        <p><b>INTERE: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="BIBLIO">
        <p><b>BIBLIO: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="AUTOR">
        <p><b>AUTOR: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="DATA">
        <p><b>DATA: </b><xsl:value-of select="."/></p>
    </xsl:template>
    
    <xsl:template match="LIGA">
        <i><xsl:value-of select="."/></i>
    </xsl:template>

</xsl:stylesheet>
